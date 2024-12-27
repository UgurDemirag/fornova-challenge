import { ElevatorSystem } from './ElevatorSystem';
import { OptimalDispatch } from './strategies/OptimalDispatch';
import { Direction, ElevatorState } from './types/Enums';

export class ElevatorSimulation {
	private system: ElevatorSystem;
	private maxFloor: number = 20;
	private intervalId?: ReturnType<typeof setInterval>;

	constructor(numElevators: number) {
		this.system = new ElevatorSystem(numElevators, new OptimalDispatch());
	}

	start() {
		this.intervalId = setInterval(() => {
			this.generateRandomRequest();
			this.displayStatus();
		}, 1500);
	}

	stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	private generateRandomRequest() {
		const sourceFloor: number = Math.floor(Math.random() * this.maxFloor) + 1;
		let destFloor: number;

		do destFloor = Math.floor(Math.random() * this.maxFloor) + 1;
		while (destFloor === sourceFloor);

		const direction = destFloor > sourceFloor ? Direction.UP : Direction.DOWN;
		const elevator = this.system.requestElevator(sourceFloor, direction);

		if (elevator) {
			console.log(`\nNew request: Floor ${sourceFloor} -> ${destFloor}`);

			// Simulate elevator movement to source floor
			this.system.updateElevatorStatus(elevator.id, sourceFloor, ElevatorState.MOVING, direction);

			// Simulate elevator reaching destination
			setTimeout(() => {
				this.system.updateElevatorStatus(elevator.id, destFloor, ElevatorState.STOPPED, Direction.IDLE);
			}, 1000);
		}
	}

	private displayStatus() {
		console.log('\n=== Elevator Status ===');
		for (let i = this.maxFloor; i >= 1; i--) {
			let floorDisplay = i.toString().padStart(2, '0') + ' |';

			for (let j = 1; j <= this.system.getElevatorCount(); j++) {
				const elevator = this.system.getElevator(j);
				if (elevator?.currentFloor === i) {
					floorDisplay += ` [E${elevator.id}:${elevator.direction}:${elevator.state}] `;
				} else {
					floorDisplay += '                    ';
				}
			}
			console.log(floorDisplay);
		}
		console.log('====================\n');
	}
}

const simulation = new ElevatorSimulation(3);
simulation.start();

setTimeout(() => {
	simulation.stop();
	console.log('Simulation ended');
}, 60000);