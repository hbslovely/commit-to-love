import { Routes } from '@angular/router';
import { MemoryPlacesComponent } from './memory-places.component';
import { PlaceDetailComponent } from '../place-detail/place-detail.component';

export const MEMORY_PLACES_ROUTES: Routes = [
  {
    path: '',
    component: MemoryPlacesComponent
  },
  {
    path: ':id',
    component: PlaceDetailComponent
  }
];
