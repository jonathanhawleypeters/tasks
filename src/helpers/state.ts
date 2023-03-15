import { taskHistory, localStorageIsSupported } from './history';
import { ActionType, type Task } from './types';

const rowValues = (
	row: string
): [ActionType, string | undefined, number | null, number | null, number | null] => {
  const [TYPE, description, ...dates] = row.split('\t').map((maybeString) => maybeString?.trim());
  
	const [createdAt, scheduledAt, completedAt] = dates.map((date) => (date ? Number(date) : null));
  
	// ${type} ${description}, ${createdAt}, ${scheduledAt}, ${completedAt}`
	return [TYPE as ActionType, description, createdAt, scheduledAt, completedAt];
};

const updateState = (
	stateMap: Map<number, Task>,
	type: ActionType,
	description: string | undefined,
	createdAt: number | null,
	scheduledAt: number | null,
	completedAt: number | null
) => {
	if (!createdAt) {
		console.warn(
			'created date not present',
			type,
			description,
			createdAt,
			scheduledAt,
			completedAt
		);
		return stateMap;
	}

	const current = stateMap.get(createdAt);

	if (type !== ActionType.add && !current) {
		console.warn(
			`Invalid update: type: ${type}, description: ${description}, createdAt: ${createdAt}, scheduledAt: ${scheduledAt}, completedAt: ${completedAt}`
		);
		return stateMap;
	}

	switch (type) {
		case 'ADD': {
			if (!description) {
				console.warn(
					'tasks cannot be created without a description',
					type,
					description,
					createdAt,
					scheduledAt,
					completedAt
				);
				return stateMap;
			}
			return stateMap.set(createdAt, {
				description,
				createdAt,
				completed: false,
				...(scheduledAt ? { scheduledAt } : {})
			});
		}
		case 'COMPLETE':
			return stateMap.set(createdAt, {
				...(current as Task),
				completedAt: completedAt as number,
				completed: true
			});
		case 'UNCOMPLETE': {
			const task = current as Task;
			return stateMap.set(createdAt, {
				...current,
				createdAt,
				description: task.description,
				completed: false,
				...(task.scheduledAt ? { scheduledAt: task.scheduledAt } : {})
			});
		}
		case 'UPDATE':
			return stateMap.set(createdAt, {
				...(current as Task),
				description: description as string
			});
		case 'SCHEDULE':
			return stateMap.set(createdAt, {
				...(current as Task),
				scheduledAt: scheduledAt as number
			});
		case 'DELETE': {
			if (!stateMap.delete(createdAt)) {
				console.warn(
					`Cannot delete todo created at ${createdAt} with the description ${description}, it could not be found`
				);
			}
			return stateMap;
		}
		default: {
			console.warn(
				`No action type matches ${type}`,
				description,
				createdAt,
				scheduledAt,
				completedAt
			);
			return stateMap;
		}
	}
};

export const stateFromLocalStorage = () => {
	if (localStorageIsSupported()) {
		const history = taskHistory();

		if (!history) return [];

		const rows = history.split('\n');

		const todosByCreationDate = rows.reduce((acc, row) => {
			updateState(acc, ...rowValues(row));
			return acc;
		}, new Map());

		return Array.from(todosByCreationDate.values());
	}

	return [];
};
