package com.sih.fake_idenity_screening.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sih.fake_idenity_screening.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}