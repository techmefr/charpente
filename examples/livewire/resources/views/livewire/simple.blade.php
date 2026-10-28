<x-charpente :loading="$loading" tag="main" data-testid="root" class="page">
  <header class="page__head">
    <h1>Équipe</h1>
    <p>Quatre collaborateurs</p>
  </header>
  <ul class="people">
    @foreach ([
      ['Camille Durand', 'Cheffe de projet', 'camille'],
      ['Mehdi Lambert', 'Développeur front', 'mehdi'],
      ['Inès Morel', 'Designeuse', 'ines'],
      ['Hugo Perrin', 'Développeur back', 'hugo'],
    ] as [$name, $role, $handle])
      <li class="person" wire:key="{{ $handle }}">
        <img class="person__avatar" width="48" height="48" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
        <div class="person__body">
          <h2>{{ $name }}</h2>
          <p>{{ $role }}</p>
        </div>
        <a href="mailto:{{ $handle }}@exemple.fr">{{ $handle }}@exemple.fr</a>
      </li>
    @endforeach
  </ul>
</x-charpente>
