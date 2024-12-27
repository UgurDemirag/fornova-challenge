import { IDispatchStrategy, IElevator } from '../types/Interfaces';
import { Direction } from '../types/Enums';

export class OptimalDispatch implements IDispatchStrategy {
	private calculateScore(elevator: IElevator, requestFloor: number, requestDirection: Direction): number {
		let score = Math.abs(elevator.currentFloor - requestFloor);

		if (elevator.direction !== Direction.IDLE) {
			if ((elevator.direction === Direction.UP && requestFloor < elevator.currentFloor) || (elevator.direction === Direction.DOWN && requestFloor > elevator.currentFloor)) {
				score += 10;
			}
		}

		if (elevator.direction === requestDirection) score -= 2;
		if (elevator.direction === Direction.IDLE) score -= 1;

		return score;
	}

	selectElevator(elevators: IElevator[], requestFloor: number, requestDirection: Direction): IElevator | null {
		if (elevators.length === 0) return null;

		return elevators.reduce((best, current) => {
			const currentScore = this.calculateScore(current, requestFloor, requestDirection);
			const bestScore = best ? this.calculateScore(best, requestFloor, requestDirection) : Number.MAX_VALUE;
			return currentScore < bestScore ? current : best;
		}, null as IElevator | null);
	}
}