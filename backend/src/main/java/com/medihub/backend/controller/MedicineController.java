
package com.medihub.backend.controller; // Updated to match your screenshot

import com.medihub.backend.model.Medicine;
import com.medihub.backend.repository.MedicineRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicineController {

    private final MedicineRepository repository;

    public MedicineController(MedicineRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return repository.findAll();
    }

    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return repository.save(medicine);
    }
}