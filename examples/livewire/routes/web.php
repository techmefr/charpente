<?php

use App\Livewire\Complex;
use App\Livewire\Simple;
use Illuminate\Support\Facades\Route;

Route::view('/', 'home');
Route::livewire('/simple', Simple::class);
Route::livewire('/complex', Complex::class);
