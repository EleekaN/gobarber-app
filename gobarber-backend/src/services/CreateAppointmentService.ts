import {getCustomRepository} from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';
import {startOfHour} from 'date-fns';
import AppError from '../errors/AppError';
import * as HttpStatus from 'http-status-codes';

interface Request {
  providerId: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({date, providerId}: Request): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment os already booked', HttpStatus.BAD_REQUEST);
    }

    const appointment = appointmentRepository.create({
      provider_id: providerId,
      date: appointmentDate,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
