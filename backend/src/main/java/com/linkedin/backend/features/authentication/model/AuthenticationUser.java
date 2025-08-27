package com.linkedin.backend.features.authentication.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.linkedin.backend.features.feed.model.Post;
import com.linkedin.backend.features.notifications.model.Notification;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "users")
public class AuthenticationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    private Boolean emailVerified = false;

    private String emailVerificationToken = null;

    private LocalDateTime emailVerificationTokenExpiryDate = null;

    @JsonIgnore
    private String password;

    private String passwordResetToken = null;

    private LocalDateTime passwordResetTokenExpiryDate = null;

    private String firstName = null;

    private String lastName = null;

    private String company = null;

    private String position = null;

    private String location = null;

    private String profilePicture = null;

    private Boolean profileComplete = false;

    @JsonIgnore
    @OneToMany(
            mappedBy = "author",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Post> posts;

    @JsonIgnore
    @OneToMany(
            mappedBy = "recipient",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Notification> receivedNotification;

    @JsonIgnore
    @OneToMany(
            mappedBy = "actor",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Notification> actedNotification;

    public AuthenticationUser(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public AuthenticationUser() {}

    private void updateProfileCompletionStatus() {
        this.profileComplete = (this.firstName != null && this.lastName != null && this.company != null && this.position != null && this.location != null);
    }

    public AuthenticationUser(Long id,
                              String email,
                              Boolean emailVerified,
                              String emailVerificationToken,
                              LocalDateTime emailVerificationTokenExpiryDate,
                              String password,
                              String passwordResetToken,
                              LocalDateTime passwordResetTokenExpiryDate,
                              String firstName,
                              String lastName,
                              String company,
                              String position,
                              String location) {
        this.id = id;
        this.email = email;
        this.emailVerified = emailVerified;
        this.emailVerificationToken = emailVerificationToken;
        this.emailVerificationTokenExpiryDate = emailVerificationTokenExpiryDate;
        this.password = password;
        this.passwordResetToken = passwordResetToken;
        this.passwordResetTokenExpiryDate = passwordResetTokenExpiryDate;
        this.firstName = firstName;
        this.lastName = lastName;
        this.company = company;
        this.position = position;
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public LocalDateTime getEmailVerificationTokenExpiryDate() {
        return emailVerificationTokenExpiryDate;
    }

    public void setEmailVerificationTokenExpiryDate(LocalDateTime emailVerificationTokenExpiryDate) {
        this.emailVerificationTokenExpiryDate = emailVerificationTokenExpiryDate;
    }

    public String getPasswordResetToken() {
        return passwordResetToken;
    }

    public void setPasswordResetToken(String passwordResetToken) {
        this.passwordResetToken = passwordResetToken;
    }

    public LocalDateTime getPasswordResetTokenExpiryDate() {
        return passwordResetTokenExpiryDate;
    }

    public void setPasswordResetTokenExpiryDate(LocalDateTime passwordResetTokenExpiryDate) {
        this.passwordResetTokenExpiryDate = passwordResetTokenExpiryDate;
    }

    public String getEmailVerificationToken() {
        return emailVerificationToken;
    }

    public void setEmailVerificationToken(String emailVerificationToken) {
        this.emailVerificationToken = emailVerificationToken;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
        updateProfileCompletionStatus();
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
        updateProfileCompletionStatus();
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
        updateProfileCompletionStatus();
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
        updateProfileCompletionStatus();
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        updateProfileCompletionStatus();
    }

    public Boolean getProfileComplete() {
        return profileComplete;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public void setProfileComplete(Boolean profileComplete) {
        this.profileComplete = profileComplete;
    }

    public List<Notification> getReceivedNotification() {
        return receivedNotification;
    }

    public void setReceivedNotification(List<Notification> receivedNotification) {
        this.receivedNotification = receivedNotification;
    }

    public List<Notification> getActedNotification() {
        return actedNotification;
    }

    public void setActedNotification(List<Notification> actedNotification) {
        this.actedNotification = actedNotification;
    }
}
