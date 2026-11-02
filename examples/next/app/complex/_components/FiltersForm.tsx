export function FiltersForm() {
  return (
    <form className="filters" aria-label="Filtres">
      <h2>Filtres</h2>
      <label>Client <input type="text" name="customer" placeholder="Nom du client" /></label>
      <label>Statut
        <select name="status">
          <option>Tous</option>
          <option>Payée</option>
          <option>En cours</option>
        </select>
      </label>
      <label>Note <textarea name="note" rows={3} placeholder="Remarque"></textarea></label>
      <label className="check"><input type="checkbox" name="late" /> Retards seulement</label>
      <button type="submit">Appliquer</button>
    </form>
  )
}
