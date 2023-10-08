namespace Movie.Auth
{
    public class AuthorizeOperationResult
    {
        public bool Successed { get; set; }

        public string JwtToken { get; set; }

        public Dictionary<string, List<string>> Errors { get; set; } = new Dictionary<string, List<string>>();

        public AuthorizeOperationResult(bool seccessed)
        {
            Successed = seccessed;
        }

        public AuthorizeOperationResult(bool seccessed, string jwtInfo)
        {
            Successed = seccessed;
            JwtToken = jwtInfo;
        }

        public void AddError(string propertyName, string error)
        {
            if (!Errors.ContainsKey(propertyName))
            {
                Errors[propertyName] = new List<string>();
            }

            Errors[propertyName].Add(error);
        }
    }
}
