@props([
    'loading' => false,
    'tag' => 'div',
    'theme' => null,
    'motion' => null,
    'delay' => null,
    'stagger' => null,
    'label' => '',
])
@php
    $motionValue = is_array($motion)
        ? (count($motion) === 0 ? 'none' : implode(' ', collect($motion)->sort()->all()))
        : $motion;
    $variables = collect([
        '--charpente-delay' => $delay === null ? null : $delay.'ms',
        '--charpente-stagger' => $stagger === null ? null : $stagger.'ms',
    ])->filter()->map(fn ($value, $name) => $name.':'.$value)->implode(';');
@endphp
<{{ $tag }} {{ $attributes->merge([
    'style' => $variables ?: null,
    'data-charpente-theme' => $theme,
    'data-charpente-motion' => $motionValue,
    'aria-busy' => $loading ? 'true' : null,
]) }} @if ($loading) data-charpente-loading inert @endif>{{ $slot }}</{{ $tag }}>
@if ($loading && $label !== '')
<span role="status" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">{{ $label }}</span>
@endif
