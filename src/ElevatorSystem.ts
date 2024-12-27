import { IDispatchStrategy, IElevator } from './types/Interfaces';
import { Elevator } from './Elevator';
import { Direction, ElevatorState } from './types/Enums';

export class ElevatorSystem {
	private elevators: IElevator[] = [];
	private dispatchStrategy: IDispatchStrategy;

	constructor(numElevators: number, strategy: IDispatchStrategy) {
		this.dispatchStrategy = strategy;
		for (let i = 0; i < numElevators; i++) {
			this.elevators.push(new Elevator(i + 1));
		}
	}

	requestElevator(floor: number, direction: Direction): IElevator | null {
		const selectedElevator = this.dispatchStrategy.selectElevator(this.elevators, floor, direction);

		if (selectedElevator) {
			selectedElevator.destinationFloor = floor;
			selectedElevator.move();
		}

		return selectedElevator;
	}

	getElevator(id: number): IElevator | undefined {
		return this.elevators.find(e => e.id === id);
	}

	getElevatorCount(): number {
		return this.elevators.length;
	}

	updateElevatorStatus(id: number, floor: number, state: ElevatorState, direction: Direction) {
		const elevator = this.getElevator(id);
		if (elevator) {
			elevator.currentFloor = floor;
			elevator.state = state;
			elevator.direction = direction;
		}
	}
}