import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject } from 'rxjs';

export interface Searchable {
  searchTerm: string;
  object: any;
}

@Component({
  selector: 'typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss']
})
export class TypeaheadComponent {

  constructor() {
    this.selectItem$.subscribe((data) => {
      this.selectItem.emit(this.data.find(item => item.searchTerm === data.item)?.object);
    });
  }

  @Input()
  placeholder = '';

  model: any;

  @Input()
  data: Searchable[] = [];

	@ViewChild(NgbTypeahead)instance!: NgbTypeahead;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();
  selectItem$ = new Subject<any>();

  @Output('selectItem')
  selectItem = new EventEmitter<any>();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
		const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
		const inputFocus$ = this.focus$;
    console.log(this.data);
		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			map((term) =>
				(term === '' ? this.data.map(item => item.searchTerm) : this.data.map(item => item.searchTerm).filter((item) => item.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
			),
		);
	};

}
