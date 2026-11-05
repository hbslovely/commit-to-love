import { Pipe, PipeTransform } from '@angular/core';

interface Food {
  person: string;
  dish: string;
  imageUrl: string;
  story: string;
  feeling: string;
}

@Pipe({
  name: 'filter',
  standalone: true
})
export class PersonFilterPipe implements PipeTransform {
  transform(foods: Food[] | null, person: string): Food[] {
    if (!foods) return [];
    return foods.filter(food => food.person === person);
  }
}
