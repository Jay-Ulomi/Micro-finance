import api from "./config";

// Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  eventType: 'meeting' | 'appointment' | 'payment_due' | 'loan_maturity' | 'reminder' | 'holiday' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  location?: string;
  attendees: string[];
  reminderMinutes?: number[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  };
  relatedEntity?: {
    type: 'loan' | 'borrower' | 'repayment' | 'investment';
    id: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCalendarEventData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  eventType: 'meeting' | 'appointment' | 'payment_due' | 'loan_maturity' | 'reminder' | 'holiday' | 'other';
  priority: 'low' | 'medium' | 'high';
  location?: string;
  attendees: string[];
  reminderMinutes?: number[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  };
  relatedEntity?: {
    type: 'loan' | 'borrower' | 'repayment' | 'investment';
    id: string;
  };
}

export interface CalendarView {
  view: 'day' | 'week' | 'month' | 'year';
  date: string;
  events: CalendarEvent[];
}

export interface PaymentReminder {
  id: string;
  borrowerId: string;
  borrowerName: string;
  loanId: string;
  repaymentId: string;
  dueDate: string;
  amount: number;
  reminderDate: string;
  status: 'pending' | 'sent' | 'failed';
  method: 'sms' | 'email' | 'call';
  message?: string;
  sentAt?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  title: string;
  borrowerId: string;
  borrowerName: string;
  loanOfficerId: string;
  loanOfficerName: string;
  appointmentDate: string;
  duration: number; // in minutes
  purpose: 'loan_application' | 'repayment' | 'kyc_verification' | 'consultation' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  location: string;
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  title: string;
  borrowerId: string;
  loanOfficerId: string;
  appointmentDate: string;
  duration: number;
  purpose: 'loan_application' | 'repayment' | 'kyc_verification' | 'consultation' | 'other';
  location: string;
  notes?: string;
}

// API Functions
export const calendarApi = {
  // Calendar Events
  async getCalendarEvents(params: {
    startDate: string;
    endDate: string;
    eventType?: string;
    priority?: string;
    status?: string;
    attendeeId?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
  }): Promise<CalendarEvent[]> {
    const response = await api.get("/calendar/events", { params });
    return response.data;
  },

  async getCalendarEvent(id: string): Promise<CalendarEvent> {
    const response = await api.get(`/calendar/events/${id}`);
    return response.data;
  },

  async createCalendarEvent(data: CreateCalendarEventData): Promise<CalendarEvent> {
    const response = await api.post("/calendar/events", data);
    return response.data;
  },

  async updateCalendarEvent(id: string, data: Partial<CreateCalendarEventData>): Promise<CalendarEvent> {
    const response = await api.put(`/calendar/events/${id}`, data);
    return response.data;
  },

  async deleteCalendarEvent(id: string): Promise<void> {
    await api.delete(`/calendar/events/${id}`);
  },

  async completeCalendarEvent(id: string, data: { notes?: string }): Promise<CalendarEvent> {
    const response = await api.post(`/calendar/events/${id}/complete`, data);
    return response.data;
  },

  async cancelCalendarEvent(id: string, data: { reason: string }): Promise<CalendarEvent> {
    const response = await api.post(`/calendar/events/${id}/cancel`, data);
    return response.data;
  },

  // Calendar Views
  async getCalendarView(params: {
    view: 'day' | 'week' | 'month' | 'year';
    date: string;
    eventType?: string;
    priority?: string;
  }): Promise<CalendarView> {
    const response = await api.get("/calendar/view", { params });
    return response.data;
  },

  // Payment Reminders
  async getPaymentReminders(params: {
    startDate?: string;
    endDate?: string;
    status?: string;
    method?: string;
    borrowerId?: string;
  } = {}): Promise<PaymentReminder[]> {
    const response = await api.get("/calendar/payment-reminders", { params });
    return response.data;
  },

  async createPaymentReminder(data: {
    borrowerId: string;
    loanId: string;
    repaymentId: string;
    reminderDate: string;
    method: 'sms' | 'email' | 'call';
    message?: string;
  }): Promise<PaymentReminder> {
    const response = await api.post("/calendar/payment-reminders", data);
    return response.data;
  },

  async sendPaymentReminder(id: string): Promise<PaymentReminder> {
    const response = await api.post(`/calendar/payment-reminders/${id}/send`);
    return response.data;
  },

  async bulkSendPaymentReminders(reminderIds: string[]): Promise<{
    sent: number;
    failed: number;
    errors: any[];
  }> {
    const response = await api.post("/calendar/payment-reminders/bulk-send", { reminderIds });
    return response.data;
  },

  // Appointments
  async getAppointments(params: {
    startDate?: string;
    endDate?: string;
    borrowerId?: string;
    loanOfficerId?: string;
    status?: string;
    purpose?: string;
  } = {}): Promise<Appointment[]> {
    const response = await api.get("/calendar/appointments", { params });
    return response.data;
  },

  async getAppointment(id: string): Promise<Appointment> {
    const response = await api.get(`/calendar/appointments/${id}`);
    return response.data;
  },

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const response = await api.post("/calendar/appointments", data);
    return response.data;
  },

  async updateAppointment(id: string, data: Partial<CreateAppointmentData>): Promise<Appointment> {
    const response = await api.put(`/calendar/appointments/${id}`, data);
    return response.data;
  },

  async deleteAppointment(id: string): Promise<void> {
    await api.delete(`/calendar/appointments/${id}`);
  },

  async completeAppointment(id: string, data: { notes?: string }): Promise<Appointment> {
    const response = await api.post(`/calendar/appointments/${id}/complete`, data);
    return response.data;
  },

  async cancelAppointment(id: string, data: { reason: string }): Promise<Appointment> {
    const response = await api.post(`/calendar/appointments/${id}/cancel`, data);
    return response.data;
  },

  async markNoShow(id: string, data: { notes?: string }): Promise<Appointment> {
    const response = await api.post(`/calendar/appointments/${id}/no-show`, data);
    return response.data;
  },

  // Availability
  async getLoanOfficerAvailability(loanOfficerId: string, params: {
    startDate: string;
    endDate: string;
  }): Promise<{
    date: string;
    availableSlots: {
      startTime: string;
      endTime: string;
      available: boolean;
    }[];
  }[]> {
    const response = await api.get(`/calendar/availability/${loanOfficerId}`, { params });
    return response.data;
  },

  async checkAvailability(data: {
    loanOfficerId: string;
    appointmentDate: string;
    duration: number;
  }): Promise<{ available: boolean; conflicts: any[] }> {
    const response = await api.post("/calendar/check-availability", data);
    return response.data;
  },

  // Notifications
  async getUpcomingEvents(params: {
    days: number;
    eventType?: string;
    priority?: string;
  } = { days: 7 }): Promise<CalendarEvent[]> {
    const response = await api.get("/calendar/upcoming-events", { params });
    return response.data;
  },

  async getOverduePayments(): Promise<PaymentReminder[]> {
    const response = await api.get("/calendar/overdue-payments");
    return response.data;
  },

  async getTodaySchedule(): Promise<{
    appointments: Appointment[];
    events: CalendarEvent[];
    reminders: PaymentReminder[];
  }> {
    const response = await api.get("/calendar/today-schedule");
    return response.data;
  },

  // Bulk Operations
  async bulkCreateEvents(events: CreateCalendarEventData[]): Promise<{
    created: number;
    failed: number;
    errors: any[];
  }> {
    const response = await api.post("/calendar/events/bulk-create", { events });
    return response.data;
  },

  async bulkUpdateEvents(eventIds: string[], updates: Partial<CreateCalendarEventData>): Promise<void> {
    await api.put("/calendar/events/bulk-update", { eventIds, updates });
  },

  async bulkDeleteEvents(eventIds: string[]): Promise<void> {
    await api.delete("/calendar/events/bulk-delete", { data: { eventIds } });
  },

  // Export
  async exportCalendar(params: {
    startDate: string;
    endDate: string;
    format: 'ics' | 'csv' | 'pdf';
    eventType?: string;
  }): Promise<Blob> {
    const response = await api.get("/calendar/export", {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Reports
  async getCalendarReport(params: {
    startDate: string;
    endDate: string;
    reportType: 'summary' | 'detailed' | 'attendance';
    eventType?: string;
  }): Promise<any> {
    const response = await api.get("/calendar/reports", { params });
    return response.data;
  },

  async getAppointmentReport(params: {
    startDate: string;
    endDate: string;
    loanOfficerId?: string;
    purpose?: string;
  }): Promise<any> {
    const response = await api.get("/calendar/appointment-reports", { params });
    return response.data;
  },
};
