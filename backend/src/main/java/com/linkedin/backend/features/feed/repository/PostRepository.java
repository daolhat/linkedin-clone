package com.linkedin.backend.features.feed.repository;

import com.linkedin.backend.features.feed.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

//    @Query("select p from Post p where p.author.id <> :authenticatedUserId order by p.creationDate desc")
//    List<Post> findByAuthorIdNotOrderByCreationDateDesc(@Param("authenticatedUserId") Long authenticatedUserId);

    List<Post> findByAuthorIdNotOrderByCreationDateDesc(Long authenticatedUserId);

    List<Post> findAllByOrderByCreationDateDesc();

    List<Post> findByAuthorId(Long userId);
}
