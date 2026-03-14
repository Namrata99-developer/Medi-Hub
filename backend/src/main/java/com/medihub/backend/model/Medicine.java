
package com.medihub.backend.model; // Updated to match your screenshot

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private double price;
    private int stock;
}