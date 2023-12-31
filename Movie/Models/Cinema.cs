﻿using System.ComponentModel.DataAnnotations.Schema;

namespace Movie.Models
{
    public class Cinema
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string CompanyLogin { get; set; }
        public byte[] Logo { get; set; }
        public Company Company { get; set; }
        public List<Hall> Halls { get; set; }
    }
}
