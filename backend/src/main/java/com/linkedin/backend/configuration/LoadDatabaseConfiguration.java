package com.linkedin.backend.configuration;

import com.linkedin.backend.features.authentication.model.AuthenticationUser;
import com.linkedin.backend.features.authentication.repository.AuthenticationUserRepository;
import com.linkedin.backend.features.authentication.utils.Encoder;
import com.linkedin.backend.features.feed.model.Post;
import com.linkedin.backend.features.feed.repository.PostRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Random;

@Configuration
public class LoadDatabaseConfiguration {

    private final Encoder encoder;

    public LoadDatabaseConfiguration(Encoder encoder) {
        this.encoder = encoder;
    }

    @Bean
    public CommandLineRunner initDatabase(AuthenticationUserRepository authenticationUserRepository, PostRepository postRepository) {
        return args -> {
//            AuthenticationUser authenticationUser = new AuthenticationUser("nhat@example.com", encoder.encode("nhat12345"));
//            authenticationUserRepository.save(authenticationUser);
            List<AuthenticationUser> users = createUsers(authenticationUserRepository);
            createPosts(postRepository, users);
        };
    }

    private List<AuthenticationUser> createUsers(AuthenticationUserRepository authenticationUserRepository) {
        List<AuthenticationUser> users = List.of(
                createUser("nhat@example.com", "nhat", "Nhat", "Dao", "Developer", "CompanyOne",
                        "Ha noi", "https://cdn.pixabay.com/photo/2025/06/19/07/59/allgau-9668453_640.jpg"),
                createUser("namd@example.com", "namd", "Nam", "Nguyen", "Test", "CompanyTwo",
                        "Ha noi", "https://cdn.pixabay.com/photo/2025/06/19/07/59/allgau-9668453_640.jpg"),
                createUser("phuong@example.com", "phuong", "Phuong", "Le", "HR", "CompanyThree",
                        "Ha noi", "https://cdn.pixabay.com/photo/2025/06/19/07/59/allgau-9668453_640.jpg"),
                createUser("tung@example.com", "tung", "Tung", "Nguyen", "PM", "CompanyFour",
                        "Ha noi", "https://cdn.pixabay.com/photo/2025/06/19/07/59/allgau-9668453_640.jpg"),
                createUser("linh@example.com", "linh", "Linh", "Pham", "Data engineer", "CompanyFive",
                        "Ha noi", "https://cdn.pixabay.com/photo/2025/06/19/07/59/allgau-9668453_640.jpg")
        );

        authenticationUserRepository.saveAll(users);
        return users;
    }

    private AuthenticationUser createUser(String email, String password, String firstName, String lastName, String position,
                                          String company, String location, String profilePicture) {
        AuthenticationUser user = new AuthenticationUser(email, encoder.encode(password));
        user.setEmailVerified(true);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPosition(position);
        user.setCompany(company);
        user.setLocation(location);
        user.setProfilePicture(profilePicture);
        return user;
    }

    private void createPosts(PostRepository postRepository, List<AuthenticationUser> users) {
        Random random = new Random();
        for (int i = 0; i <= 10; i++) {
            Post post = new Post("Xin chao", users.get(random.nextInt(users.size())));
            post.setLikes(generateLikes(users, i, random));
            if (i == 1) {
                post.setPicture("https://cdn.pixabay.com/photo/2025/06/19/07/59/allgau-9668453_640.jpg");
            }
            postRepository.save(post);
        }
    }

    private HashSet<AuthenticationUser> generateLikes(List<AuthenticationUser> users, int postNumber, Random random) {
        HashSet<AuthenticationUser> likes = new HashSet<>();
        if (postNumber == 1) {
            while (likes.size() < 3) {
                likes.add(users.get(random.nextInt(users.size())));
            }
        } else {
            int likeCount = switch (postNumber % 5) {
                case 0 -> 3;
                case 2, 3 -> 2;
                default -> 1;
            };
            for (int i = 0; i < likeCount; i++) {
                likes.add(users.get(random.nextInt(users.size())));
            }
        }
        return likes;
    }

}
