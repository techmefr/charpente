<script lang="ts">
  let { data } = $props()

  const people = [
    { name: "Camille Durand", role: "Cheffe de projet", mail: "camille@exemple.fr" },
    { name: "Mehdi Lambert", role: "Développeur front", mail: "mehdi@exemple.fr" },
    { name: "Inès Morel", role: "Designeuse", mail: "ines@exemple.fr" },
    { name: "Hugo Perrin", role: "Développeur back", mail: "hugo@exemple.fr" },
  ]
  const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
</script>

<main
  data-testid="root"
  class="page"
  data-charpente-loading={data.loading ? "" : undefined}
  aria-busy={data.loading ? "true" : undefined}
  inert={data.loading}
>
  <header class="page__head">
    <h1>Équipe</h1>
    <p>Quatre collaborateurs</p>
  </header>
  <ul class="people">
    {#each people as person}
      <li class="person">
        <img class="person__avatar" width="48" height="48" alt="" src={pixel} />
        <div class="person__body">
          <h2>{person.name}</h2>
          <p>{person.role}</p>
        </div>
        <a href="mailto:{person.mail}">{person.mail}</a>
      </li>
    {/each}
  </ul>
</main>
