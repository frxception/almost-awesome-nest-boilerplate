/* eslint-disable @typescript-eslint/naming-convention */
import { Reflector } from '@nestjs/core';

// biome-ignore lint/style/useNamingConvention: <explanation>
export const Roles = Reflector.createDecorator<string[]>();
