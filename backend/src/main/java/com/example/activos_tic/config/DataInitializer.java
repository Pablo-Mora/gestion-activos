package com.example.activos_tic.config;

import com.example.activos_tic.domain.model.ERole;
import com.example.activos_tic.domain.model.Role;
import com.example.activos_tic.domain.model.User;
import com.example.activos_tic.domain.repository.RoleRepository;
import com.example.activos_tic.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting data initialization...");

        // Create ROLE_USER if it doesn't exist
        Optional<Role> userRoleOpt = roleRepository.findByName(ERole.ROLE_USER);
        Role userRole;
        if (userRoleOpt.isEmpty()) {
            userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            roleRepository.save(userRole);
            logger.info("Created ROLE_USER");
        } else {
            userRole = userRoleOpt.get();
            logger.info("ROLE_USER already exists.");
        }

        // Create ROLE_ADMIN if it doesn't exist
        Optional<Role> adminRoleOpt = roleRepository.findByName(ERole.ROLE_ADMIN);
        Role adminRole;
        if (adminRoleOpt.isEmpty()) {
            adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
            logger.info("Created ROLE_ADMIN");
        } else {
            adminRole = adminRoleOpt.get();
            logger.info("ROLE_ADMIN already exists.");
        }

        // Create a default Admin user if none exists
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@example.com"); // Ensure this email is unique
            adminUser.setPassword(passwordEncoder.encode("admin123")); // Change this default password

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            // Optionally add ROLE_USER as well if admins should also have user privileges by default
            // roles.add(userRole);
            adminUser.setRoles(roles);

            userRepository.save(adminUser);
            logger.info("Created default admin user with username 'admin'");
        } else {
            logger.info("Admin user 'admin' already exists.");
        }

        // You can add more initial data here, e.g., sample employees or hardware, if needed for testing.
        // For example:
        // if (employeeRepository.count() == 0) {
        //     Employee sampleEmployee = new Employee(null, "John Doe", "IT", "Developer");
        //     employeeRepository.save(sampleEmployee);
        //     logger.info("Created sample employee 'John Doe'");
        // }

        logger.info("Data initialization finished.");
    }
}
