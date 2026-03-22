import { AlgorithmState, OperationType } from '../types/AlgorithmState';

/**
 * Adapter utility to normalize raw algorithm execution steps into highly predictable AlgorithmState chunks
 * suitable for the executionStore and UI rendering.
 */

export class AlgorithmAdapter<T> {
  private states: AlgorithmState<T>[] = [];
  private stepCounter = 0;

  constructor(private initialData: T) {
    this.recordState(initialData, [], OperationType.VISIT, 0, {});
  }

  /**
   * Pushes a new distinct atomic state into the execution timeline.
   */
  public recordState(
    currentData: T,
    activeIndices: number[],
    operationType: OperationType,
    highlightedLine?: number,
    variables?: Record<string, string | number | null>,
    message?: string,
    secondaryIndices?: number[]
  ) {
    // Deep clone primitive data (assuming T is JSON serializable like strict arrays)
    const clonedData = JSON.parse(JSON.stringify(currentData));
    
    this.states.push({
      data: clonedData,
      activeIndices,
      secondaryIndices,
      operationType,
      highlightedLine,
      metadata: {
        stepNumber: this.stepCounter++,
        variables,
        message
      }
    });
  }

  public getGeneratedStates(): AlgorithmState<T>[] {
    return this.states;
  }
}
