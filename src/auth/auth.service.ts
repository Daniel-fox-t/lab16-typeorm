import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../users/entities/role.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  private async getOrCreateRole(name: string): Promise<Role> {
    let role = await this.roleRepository.findOne({ where: { name } });
    if (!role) {
      role = this.roleRepository.create({ name });
      role = await this.roleRepository.save(role);
    }
    return role;
  }

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({ where: { username: dto.username } });
    if (existing) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userRole = await this.getOrCreateRole('user');

    const user = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      roles: [userRole],
    });

    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username }, relations: { roles: true } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, roles: user.roles };
    return { access_token: this.jwtService.sign(payload) };
  }
}