import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user/entity';
import { Repository } from 'typeorm';

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(payload: Partial<User>): Promise<User> {
    return this.repository.save(this.repository.create(payload));
  }

  getOneById(userId: string): Promise<User> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  getByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({
      email,
    });
  }

  async updateById(id: string, payload: Partial<User>): Promise<void> {
    await this.repository.update({ id }, payload);
  }
}
