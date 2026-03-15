package com.medihub.backend.service;

import com.medihub.backend.model.Medicine;
import com.medihub.backend.repository.MedicineRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicineService {

    private final MedicineRepository repository;

    public MedicineService(MedicineRepository repository) {
        this.repository = repository;
    }

    public List<Medicine> getAllMedicines() {
        return repository.findAll();
    }

    public Medicine addMedicine(Medicine medicine) {
        // Here you could add logic, like: if (medicine.getPrice() < 0) throw error;
        return repository.save(medicine);
    }

    //// update
    public List<Medicine> searchMedicines(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }

    public Medicine reduceStock(Long id, int quantity) {
        Medicine med = repository.findById(id).orElseThrow();
        if (med.getStock() < quantity) {
            throw new RuntimeException("Not Available");
        }
        med.setStock(med.getStock() - quantity);
        return repository.save(med);
    }
}