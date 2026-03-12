import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/users/register', userData),
};

export const doctorService = {
  search: (specialization) => api.get('/users/doctors', { params: { specialization } }),
  getById: (id) => api.get(`/users/${id}`),
  create: (doctor) => api.post('/users/doctors', doctor),
  update: (id, doctor) => api.put(`/users/doctors/${id}`, doctor),
  delete: (id) => api.delete(`/users/doctors/${id}`),
};

export const appointmentService = {
  book: (appointment) => api.post('/appointments/book', appointment),
  confirm: (id, doctorId) => api.put(`/appointments/${id}/confirm`, null, { params: { doctorId } }),
  complete: (id, doctorId) => api.put(`/appointments/${id}/complete`, null, { params: { doctorId } }),
  cancel: (id, adminId) => api.put(`/appointments/${id}/cancel`, null, { params: { adminId } }),
  getDoctorSchedule: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
};

export const adminService = {
  getAppointmentsReport: () => api.get('/admin/reports/appointments-per-doctor'),
  getRevenueReport: () => api.get('/admin/reports/revenue-per-department'),
};

export default api;
