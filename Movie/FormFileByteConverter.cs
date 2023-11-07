using Movie.Models;

namespace Movie
{
    public static class FormFileByteConverter
    {
        public static byte[] Convert(IFormFile file)
        {
            using var stream = new MemoryStream();
            file.CopyTo(stream);
            return stream.ToArray();
        }
    }
}
