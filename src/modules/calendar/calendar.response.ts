namespace CalendarResponse {
  export interface GetAll extends ApiResponse {
    timestamps: [string, number][];
  }
}

export default CalendarResponse;
