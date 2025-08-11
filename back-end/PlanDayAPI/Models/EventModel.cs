using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlanDayAPI.Models;

[Table("events")]
public class EventModel
{
    [Key]
    [Column("id")]
    public Guid Id { get; init; }
    
    [Column("title")]
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }
    
    [Column("description")]
    [MaxLength(1000)]
    [Required(AllowEmptyStrings = true)]
    
    public string Description { get; set; }
    
    [Column("date")]
    [Required]
    public DateTime Date { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
    
    [Column("event_type_id")]
    [Required]
    [ForeignKey("EventType")]
    public Guid EventTypeId { get; set; }
    
    public EventTypesModel EventType { get; set; }
    
    public EventModel(string title, string? description, DateTime date)
    {
        Id = Guid.NewGuid();
        Title = title;
        Description = description ?? string.Empty;
        Date = date;
        CreatedAt = DateTime.UtcNow;
    }
}