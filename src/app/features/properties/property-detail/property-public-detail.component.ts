import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { PropertyDto } from '../../../core/models/property-dto';
import { CommentDto, CreateCommentDto } from '../../../core/models/comment-dto';
import { LikeService } from '../../../core/services/like.service';
import { LikeTargetType } from '../../../core/models/like-dto';
import { BookingService } from '../../../core/services/booking.service';
import { CreateBookingDto } from '../../../core/models/booking-dto';

@Component({
  selector: 'app-property-public-detail',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './property-public-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class PropertyPublicDetailComponent implements OnInit {
  property: PropertyDto | null = null;
  loading = true;
  error = '';
  //kommentek 
  comments: CommentDto[] = [];
  newCommentText: string = ''; 
  submittingComment = false;
  likedCommentIds: Set<number> = new Set<number>();
  newCommentRating: number = 0; 
  stars: number[] = [1, 2, 3, 4, 5];

  //foglalas
  startDate: string = '';
  endDate: string = '';
  bookingLoading = false;
  bookingSuccess = false;
  bookingError = '';
  today: string = new Date().toISOString().split('T')[0]; // Mai dátum a naptár tiltásához (min)


  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private commentService: CommentService,
    public authService: AuthService,
    private location: Location,
    private likeService: LikeService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProperty(id);
      this.loadComments(id);

      if (this.authService.isLoggedIn()) {
        this.loadUserLikes();
      }
    }
  }

  loadProperty(id: number): void {
    this.propertyService.getPropertyById(id).subscribe({
      next: (data) => {
        this.property = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nem sikerült betölteni az ingatlant.';
        this.loading = false;
      }
    });
  }

   loadComments(propertyId: number): void {
    this.commentService.getCommentsByProperty(propertyId).subscribe({
      next: (data) => this.comments = data,
      error: (err) => console.error('Hiba a kommentek betöltésekor:', err)
    });
  }

   submitComment(): void {
    
    if (!this.property || !this.newCommentText.trim() || this.newCommentRating === 0) {
      alert('Kérlek írj véleményt és adj csillagos értékelést is!');
      return;
    }

    this.submittingComment = true;

    const dto: CreateCommentDto = {
      propertyId: this.property.id,
      content: this.newCommentText.trim(),
      rating: this.newCommentRating 
    };

    this.commentService.createComment(dto).subscribe({
      next: (newComment) => {
        this.comments.unshift(newComment);
        this.newCommentText = ''; 
        this.newCommentRating = 0; 
        this.submittingComment = false;
        
         },
      error: (err) => {
        console.error('Hiba a komment küldésekor:', err);
        this.submittingComment = false;
      }
    });
  }

   deleteComment(commentId: number): void {
    if(confirm('Biztosan törlöd ezt az értékelést?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id !== commentId);
        },
        error: (err) => console.error('Hiba törléskor:', err)
      });
    }
  }
  loadUserLikes(): void {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.likeService.getLikesByUser(userId).subscribe({
        next: (likes) => {
                    const commentLikes = likes.filter(l => l.targetType === LikeTargetType.Comment && l.commentId);
          this.likedCommentIds = new Set(commentLikes.map(l => l.commentId as number));
        },
        error: (err) => console.error('Hiba a lájkok betöltésekor:', err)
      });
    }
  }

  toggleCommentLike(commentId: number): void {
    if (!this.authService.isLoggedIn()) {
      alert('A lájkoláshoz be kell jelentkezned!');
      return;
    }

    const userId = this.authService.getUserIdFromToken();
    if (!userId) return;

    if (this.likedCommentIds.has(commentId)) {
      this.likedCommentIds.delete(commentId);
    } else {
      this.likedCommentIds.add(commentId);
    }


    this.likeService.toggleLike(userId, LikeTargetType.Comment, undefined, commentId).subscribe({
      next: (res) => {
        
        if (res.isLiked) {
          this.likedCommentIds.add(commentId);
        } else {
          this.likedCommentIds.delete(commentId);
        }
      },
      error: (err) => {
        console.error('Hiba lájkolás közben:', err);
        this.loadUserLikes(); 
      }
    });
  }

 setRating(rating: number): void {
    this.newCommentRating = rating;
  }

  goBack(): void {
    this.location.back(); 
  }

  get totalDays(): number {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (end <= start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Kiszámolja az árat a napok alapján
  get calculatedPrice(): number {
    if (!this.property) return 0;
    return this.totalDays * this.property.pricePerNight;
  }

  // Foglalás elküldése
  bookProperty(): void {
    this.bookingError = '';
    this.bookingSuccess = false;

    if (!this.authService.isLoggedIn()) {
      this.bookingError = 'A foglaláshoz be kell jelentkezned!';
      return;
    }

    if (!this.property || !this.startDate || !this.endDate) {
      this.bookingError = 'Kérlek válassz érkezési és távozási dátumot!';
      return;
    }

    if (new Date(this.startDate) >= new Date(this.endDate)) {
      this.bookingError = 'A távozás dátuma nem lehet korábban, mint az érkezésé!';
      return;
    }

    this.bookingLoading = true;
    const guestId = this.authService.getUserIdFromToken() || 0;

    const dto: CreateBookingDto = {
      propertyId: this.property.id,
      guestId: guestId,
      startDate: new Date(this.startDate).toISOString(),
      endDate: new Date(this.endDate).toISOString()
    };

    this.bookingService.createBooking(dto).subscribe({
      next: () => {
        this.bookingLoading = false;
        this.bookingSuccess = true;
        this.startDate = '';
        this.endDate = '';
        
        setTimeout(() => this.bookingSuccess = false, 5000);
      },
      error: (err) => {
        console.error('Foglalási hiba:', err);
        this.bookingError = 'Sikertelen foglalás. Lehet, hogy az időpont már foglalt, vagy szerverhiba történt.';
        this.bookingLoading = false;
      }
    });
  }
}