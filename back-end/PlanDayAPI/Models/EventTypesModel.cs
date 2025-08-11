using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlanDayAPI.Models;

[Table("event_types")]
public class EventTypesModel
{
    [Key]
    [Column("id")]
    public Guid Id { get; init; }
    
    [Column("name")]
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    
    [Column("color")]
    [Required]
    [MaxLength(7)]
    public string Color { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
    
    public ICollection<EventModel> Events { get; set; } = new List<EventModel>();
    
    public EventTypesModel(string name, string color)
    {
        Id = Guid.NewGuid();
        Name = name;
        Color = color;
        CreatedAt = DateTime.UtcNow;
    }
}