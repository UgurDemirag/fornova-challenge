import { IElevator } from './types/Interfaces';
import { Direction, ElevatorState } from './types/Enums';

export class Elevator implements IElevator {
	constructor(
		public readonly id: number,
		public currentFloor: number = 1,
		public direction: Direction = Direction.IDLE,
		public state: ElevatorState = ElevatorState.STOPPED,
		public destinationFloor?: number
	) {}

	move(): void {
		if (this.destinationFloor === undefined) return;
		this.state = ElevatorState.MOVING;
		this.direction = this.destinationFloor > this.currentFloor ? Direction.UP : Direction.DOWN;
	}

	stop(): void {
		this.state = ElevatorState.STOPPED;
		this.direction = Direction.IDLE;
		this.destinationFloor = undefined;
	}
}