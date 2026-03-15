
package com.medihub.backend.controller;

import com.medihub.backend.model.Medicine;
import com.medihub.backend.service.MedicineService; // Updated import
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicineController {

    private final MedicineService service; // Talking to Service now

    public MedicineController(MedicineService service) {
        this.service = service;
    }

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return service.getAllMedicines();
    }

    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return service.addMedicine(medicine);
    }

    // Add this inside your MedicineController class
    @PutMapping("/reduce/{id}/{quantity}")
    public Medicine reduceStock(@PathVariable Long id, @PathVariable int quantity) {
        return service.reduceStock(id, quantity);
    }
}