import { createFeatureSelector } from '@ngrx/store';
import { SharedState } from '@shared/store/models';

export const getSharedState = createFeatureSelector<SharedState>('shared');
