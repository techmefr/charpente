<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('components.layouts.app')]
class Simple extends Component
{
    public bool $loading = false;

    public function mount(): void
    {
        $this->loading = request()->query('state') === 'loading';
    }

    public function render()
    {
        return view('livewire.simple');
    }
}
