package com.linkedin.backend.features.messaging.service;

import com.linkedin.backend.features.authentication.model.AuthenticationUser;
import com.linkedin.backend.features.authentication.service.AuthenticationService;
import com.linkedin.backend.features.messaging.model.Conversation;
import com.linkedin.backend.features.messaging.model.Message;
import com.linkedin.backend.features.messaging.repository.ConversationRepository;
import com.linkedin.backend.features.messaging.repository.MessageRepository;
import com.linkedin.backend.features.notifications.service.NotificationService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagingService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final AuthenticationService authenticationService;
    private final NotificationService notificationService;

    public MessagingService(MessageRepository messageRepository, ConversationRepository conversationRepository,
                            AuthenticationService authenticationService, NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.authenticationService = authenticationService;
        this.notificationService = notificationService;
    }

    public List<Conversation> getConversationsOfUser(AuthenticationUser user) {
        return conversationRepository.findByAuthorOrRecipient(user, user);
    }

    public Conversation getConversation(AuthenticationUser user, Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() ->
                new IllegalArgumentException("Conversation not found."));

        if (!conversation.getAuthor().getId().equals(user.getId()) && !conversation.getRecipient().getId().equals(user.getId())) {
            throw new IllegalArgumentException("User not authorized to view conversation.");
        }
        return conversation;
    }

    @Transactional
    public Conversation createConversationAndAddMessage(AuthenticationUser sender, Long receiverId, String content) {
        AuthenticationUser receiver = authenticationService.getUserById(receiverId);
        conversationRepository.findByAuthorAndRecipient(sender, receiver).ifPresentOrElse(
                conversation -> {
                    throw new IllegalArgumentException("Conversation already exists, use the conversation id to send message.");
                },
                () -> {}
        );

        conversationRepository.findByAuthorAndRecipient(receiver, sender).ifPresentOrElse(
                conversation -> {
                    throw new IllegalArgumentException("Conversation already exists, use the conversation id to send message.");
                },
                () -> {}
        );

        Conversation conversation = conversationRepository.save(new Conversation(sender, receiver));
        Message message = new Message(sender, receiver, conversation, content);
        messageRepository.save(message);
        conversation.getMessages().add(message);
        notificationService.sendConversationToUsers(sender.getId(), receiver.getId(), conversation);
        return conversation;
    }

    public Message addMessageToConversation(Long conversationId, AuthenticationUser sender, Long receiverId, String content) {
        AuthenticationUser receiver = authenticationService.getUserById(receiverId);
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (!conversation.getAuthor().getId().equals(sender.getId()) && !conversation.getRecipient().getId().equals(sender.getId())) {
            throw new IllegalArgumentException("User not authorized to send message to this conversation");
        }

        if (!conversation.getAuthor().getId().equals(receiver.getId()) && !conversation.getRecipient().getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Receiver is not part of this conversation");
        }

        Message message = new Message(sender, receiver, conversation, content);
        messageRepository.save(message);
        conversation.getMessages().add(message);
        notificationService.sendMessageToConversation(conversation.getId(), message);
        notificationService.sendConversationToUsers(sender.getId(), receiver.getId(), conversation);
        return message;

    }

    public void markMessageAsRead(AuthenticationUser user, Long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new IllegalArgumentException("Message not found"));

        if (!message.getReceiver().getId().equals(user.getId())) {
            throw new IllegalArgumentException("User not authorized to mark message as read");
        }

        if (!message.getRead()) {
            message.setRead(true);
            messageRepository.save(message);
        }
    }
}
