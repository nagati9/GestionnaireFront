import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environnement';
import { Produit } from '../models/produit.model';
import { PanierProduit } from '../models/panierProduit.model';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private apiUrl = `${environment.apiUrl}`;
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}

  getPanier(): Observable<PanierProduit[]> {
    const token = localStorage.getItem('token'); // Récupérer le token du localStorage
    if (!token) {
      console.error('Token introuvable. L\'utilisateur doit être authentifié.');
      return new Observable<PanierProduit[]>((observer) => {
        observer.error('Utilisateur non authentifié');
        observer.complete();
      });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Ajouter le JWT

    return this.http.get<PanierProduit[]>(`${this.apiUrl}/PanierProduit/GetProduitsPanier`, { headers });
  }
  getCartItemCount(): Observable<number> {
    return this.cartItemCountSubject.asObservable();
  }

  // Mise à jour du nombre d'articles dans le panier
  updateCartItemCount(): void {
    this.getPanier().subscribe((produits: any[]) => {
      this.cartItemCountSubject.next(produits.length);
    });
  }
    
  addToCart(produitId: number, quantite: number): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token JWT du stockage local
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(
      `${this.apiUrl}/PanierProduit/AddToPanier/${produitId}/${quantite}`,
      null,
      { headers }
    );
  }
  removeFromCart(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Ajouter le JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.delete(`${this.apiUrl}/PanierProduit/Delete/${id}`, { headers });
  }
}