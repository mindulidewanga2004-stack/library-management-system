using LibraryAPI.Data;
using LibraryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly LibraryDbContext _db;

    public BooksController(LibraryDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<Book>>> GetAll()
    {
        var books = await _db.Books
            .AsNoTracking()
            .OrderByDescending(b => b.Id)
            .ToListAsync();

        return Ok(books);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Book>> GetById(int id)
    {
        var book = await _db.Books.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
        if (book is null) return NotFound(new { message = "Book not found." });

        return Ok(book);
    }

    [HttpPost]
    public async Task<ActionResult<Book>> Create(Book book)
    {
        _db.Books.Add(book);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Book updated)
    {
        if (id != updated.Id)
            return BadRequest(new { message = "Route id and body id do not match." });

        var existing = await _db.Books.FirstOrDefaultAsync(b => b.Id == id);
        if (existing is null) return NotFound(new { message = "Book not found." });

        existing.Title = updated.Title;
        existing.Author = updated.Author;
        existing.Description = updated.Description;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _db.Books.FirstOrDefaultAsync(b => b.Id == id);
        if (existing is null) return NotFound(new { message = "Book not found." });

        _db.Books.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
