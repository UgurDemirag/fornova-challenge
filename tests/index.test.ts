import { Elevator } from '../src/Elevator';
import { Direction, ElevatorState } from '../src/types/Enums';
import { ElevatorSystem } from '../src/ElevatorSystem';
import { OptimalDispatch } from '../src/strategies/OptimalDispatch';

describe('Elevator', () => {
	let elevator: Elevator;

	beforeEach(() => {
		elevator = new Elevator(1);
	});

	test('should initialize with default values', () => {
		expect(elevator.currentFloor).toBe(1);
		expect(elevator.direction).toBe(Direction.IDLE);
		expect(elevator.state).toBe(ElevatorState.STOPPED);
		expect(elevator.destinationFloor).toBeUndefined();
	});

	test('should move up when destination floor is higher', () => {
		elevator.destinationFloor = 5;
		elevator.move();
		expect(elevator.direction).toBe(Direction.UP);
		expect(elevator.state).toBe(ElevatorState.MOVING);
	});

	test('should move down when destination floor is lower', () => {
		elevator.currentFloor = 5;
		elevator.destinationFloor = 2;
		elevator.move();
		expect(elevator.direction).toBe(Direction.DOWN);
		expect(elevator.state).toBe(ElevatorState.MOVING);
	});

	test('should not move without destination floor', () => {
		elevator.move();
		expect(elevator.state).toBe(ElevatorState.STOPPED);
		expect(elevator.direction).toBe(Direction.IDLE);
	});

	test('should stop and reset destination', () => {
		elevator.destinationFloor = 5;
		elevator.move();
		elevator.stop();
		expect(elevator.state).toBe(ElevatorState.STOPPED);
		expect(elevator.direction).toBe(Direction.IDLE);
		expect(elevator.destinationFloor).toBeUndefined();
	});
});

describe('ElevatorSystem', () => {
	let system: ElevatorSystem;
	const numElevators = 2;

	beforeEach(() => {
		system = new ElevatorSystem(numElevators, new OptimalDispatch());
	});

	test('should initialize with correct number of elevators', () => {
		expect(system.getElevatorCount()).toBe(numElevators);
	});

	test('should get elevator by id', () => {
		const elevator = system.getElevator(1);
		expect(elevator).toBeDefined();
		expect(elevator?.id).toBe(1);
	});

	test('should return null for invalid elevator id', () => {
		expect(system.getElevator(999)).toBeUndefined();
	});

	test('should update elevator status correctly', () => {
		system.updateElevatorStatus(1, 5, ElevatorState.MOVING, Direction.UP);
		const elevator = system.getElevator(1);
		expect(elevator?.currentFloor).toBe(5);
		expect(elevator?.state).toBe(ElevatorState.MOVING);
		expect(elevator?.direction).toBe(Direction.UP);
	});

	test('should ignore status update for invalid elevator id', () => {
		system.updateElevatorStatus(999, 5, ElevatorState.MOVING, Direction.UP);
		expect(system.getElevator(999)).toBeUndefined();
	});
});

describe('OptimalDispatch', () => {
	let dispatch: OptimalDispatch;
	let elevators: Elevator[];

	beforeEach(() => {
		dispatch = new OptimalDispatch();
		elevators = [
			new Elevator(1, 1, Direction.IDLE),
			new Elevator(2, 5, Direction.UP),
			new Elevator(3, 10, Direction.DOWN)
		];
	});

	test('should select closest idle elevator', () => {
		const selected = dispatch.selectElevator(elevators, 2, Direction.UP);
		expect(selected?.id).toBe(1);
	});

	test('should prefer elevator moving in same direction', () => {
		const selected = dispatch.selectElevator(elevators, 7, Direction.UP);
		expect(selected?.id).toBe(2);
	});

	test('should handle empty elevator array', () => {
		const selected = dispatch.selectElevator([], 5, Direction.UP);
		expect(selected).toBeNull();
	});

	test('should consider direction penalties', () => {
		elevators[0].currentFloor = 6;
		elevators[1].currentFloor = 4;
		const selected = dispatch.selectElevator(elevators, 5, Direction.DOWN);
		expect(selected?.id).toBe(1);
	});
});