import type { IQuery } from '@nestjs/cqrs';

import type { Uuid } from '../../../types.ts';

export class GetPostQuery implements IQuery {
  constructor(public readonly userId: Uuid) {}
}
