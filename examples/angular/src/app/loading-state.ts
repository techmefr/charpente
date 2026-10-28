import { inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

export const isLoading = (): boolean => inject(ActivatedRoute).snapshot.queryParamMap.get('state') === 'loading'
