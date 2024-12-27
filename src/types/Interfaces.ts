import { Direction, ElevatorState } from './Enums';

export interface IElevator {
	id: number;
	currentFloor: number;
	direction: Direction;
	state: ElevatorState;
	destinationFloor?: number;

	move(): void;

	stop(): void;
}

export interface IDispatchStrategy {
	selectElevator(elevators: IElevator[], requestFloor: number, requestDirection: Direction): IElevator | null;
}