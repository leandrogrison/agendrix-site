import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datepicker',
  imports: [CommonModule],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.scss'
})
export class Datepicker implements OnInit {
  @Input() disabledDates: Date[] = [];
  @Input() openingHours: any = {};
  @Input() appointmentRules: any = {};
  @Output() dateSelected = new EventEmitter<Date>();

  currentDate = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();

  daysInMonth: (Date | null)[] = [];
  monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  dasyOfWeekExtended = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  selectedDate: Date | null = null;

  ngOnInit(): void {
    this.generateCalendar();
    this.selectInitialDate();
  }

  selectInitialDate(): void {
    let date = new Date(this.currentDate);
    date.setHours(0, 0, 0, 0);
    let count = 0;

    while (this.isDateDisabled(date) && count < 360) {
      count++;
      date.setDate(date.getDate() + 1);
    }

    if (date.getMonth() !== this.currentMonth || date.getFullYear() !== this.currentYear) {
      this.currentMonth = date.getMonth();
      this.currentYear = date.getFullYear();
      this.generateCalendar();
    }
    this.selectDate(date);
  }

  generateCalendar(): void {
    this.daysInMonth = [];
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startingDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startingDay; i++) {
      this.daysInMonth.push(null);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      this.daysInMonth.push(new Date(this.currentYear, this.currentMonth, i));
    }
  }

  previousMonth(): void {
    if (this.isPreviousMonthDisabled()) return;

    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  isPreviousMonthDisabled(): boolean {
    const today = new Date();
    const firstDayOfCurrentDisplayMonth = new Date(this.currentYear, this.currentMonth, 1);
    return firstDayOfCurrentDisplayMonth <= new Date(today.getFullYear(), today.getMonth(), 1);
  }

  isDateDisabled(date: Date | null): boolean {
    if (!date) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return true;
    }

    const maxAdvanceDays = this.appointmentRules?.maximumAdvance;
    if (typeof maxAdvanceDays === 'number' && maxAdvanceDays >= 0) {
      const lastBookableDate = new Date(today);
      lastBookableDate.setDate(today.getDate() + maxAdvanceDays);
      if (date > lastBookableDate) {
        return true;
      }
    }

    if (this.openingHours[this.dasyOfWeekExtended[date.getDay()]]?.active === false) {
      return true;
    }

    return this.disabledDates.some(disabledDate =>
      disabledDate.toDateString() === date.toDateString()
    );
  }

  selectDate(date: Date | null): void {
    if (this.isDateDisabled(date) || !date) return;
    this.selectedDate = date;
    this.dateSelected.emit(date);
  }

  isDateSelected(date: Date | null): boolean {
    return !!date && !!this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
  }
}
