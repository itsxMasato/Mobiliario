using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

public class MobiliarioDto
{
    public int Id { get; set; }
    public string? Codigo { get; set; }
    public string? Nombre { get; set; }
    public string? Descripcion { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class MobiliarioController : ControllerBase
{
    private static readonly List<MobiliarioDto> _data = new()
    {
        new MobiliarioDto { Id = 1, Codigo = "MOB-001", Nombre = "Escritorio Pro", Descripcion = "Escritorio de oficina moderno" },
        new MobiliarioDto { Id = 2, Codigo = "MOB-002", Nombre = "Silla Ergonómica", Descripcion = "Silla para oficina con soporte lumbar" }
    };

    [HttpGet]
    public IActionResult Get() => Ok(_data.Select(m => new { id = m.Id, codigo = m.Codigo, nombre = m.Nombre, descripcion = m.Descripcion }));

    [HttpPost]
    public IActionResult Post([FromBody] JsonElement payload)
    {
        try
        {
            var codigo = payload.GetProperty("codigo").GetString();
            var nombre = payload.GetProperty("nombre").GetString();
            var descripcion = payload.GetProperty("descripcion").GetString();

            if (string.IsNullOrWhiteSpace(codigo) || string.IsNullOrWhiteSpace(nombre) || string.IsNullOrWhiteSpace(descripcion))
                return BadRequest("Código, nombre y descripción son requeridos");

            var newId = _data.Count > 0 ? _data.Max(x => x.Id) + 1 : 1;
            var newMobiliario = new MobiliarioDto { Id = newId, Codigo = codigo, Nombre = nombre, Descripcion = descripcion };
            
            _data.Add(newMobiliario);
            return CreatedAtAction(nameof(Get), new { id = newId }, new { id = newId, codigo, nombre, descripcion });
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] JsonElement payload)
    {
        try
        {
            var mobiliario = _data.FirstOrDefault(x => x.Id == id);
            if (mobiliario == null)
                return NotFound("Mobiliario no encontrado");

            mobiliario.Codigo = payload.GetProperty("codigo").GetString();
            mobiliario.Nombre = payload.GetProperty("nombre").GetString();
            mobiliario.Descripcion = payload.GetProperty("descripcion").GetString();

            return Ok(new { id = mobiliario.Id, codigo = mobiliario.Codigo, nombre = mobiliario.Nombre, descripcion = mobiliario.Descripcion });
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            var mobiliario = _data.FirstOrDefault(x => x.Id == id);
            if (mobiliario == null)
                return NotFound("Mobiliario no encontrado");

            _data.Remove(mobiliario);
            return Ok("Mobiliario eliminado correctamente");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }
}
