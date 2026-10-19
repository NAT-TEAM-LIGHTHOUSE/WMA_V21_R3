import { NgbTimeStruct, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export interface NgbDateTimeStruct extends NgbDateStruct, NgbTimeStruct {}

export class DateModel implements NgbDateStruct {
  year: number;
  month: number;
  day: number;

  timeZoneOffset: number;

  public constructor(init?: Partial<DateModel>) {
    Object.assign(this, init);
  }

  public static fromLocalString(dateString: string): DateModel {
    const date = new Date(dateString);

    const isValidDate = !isNaN(date.valueOf());

    if (!dateString || !isValidDate) {
      return null;
    }

    return new DateModel({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),

      timeZoneOffset: date.getTimezoneOffset()
    });
  }

  private isInteger(value: any): value is number {
    return (
      typeof value === "number" &&
      isFinite(value) &&
      Math.floor(value) === value
    );
  }

  public toString(): string {
    if (
      this.isInteger(this.year) &&
      this.isInteger(this.month) &&
      this.isInteger(this.day)
    ) {
      const year = this.year.toString().padStart(2, "0");
      const month = this.month.toString().padStart(2, "0");
      const day = this.day.toString().padStart(2, "0");

      if (!this.timeZoneOffset) {
        this.timeZoneOffset = new Date().getTimezoneOffset();
      }
      
      const tzo = -this.timeZoneOffset;
      const dif = tzo >= 0 ? "+" : "-",
        pad = function(num) {
          const norm = Math.floor(Math.abs(num));
          return (norm < 10 ? "0" : "") + norm;
        };

      const isoString = `${pad(year)}-${pad(month)}-${pad(day)}`;
      return isoString;
    }

    return null;
  }
}
