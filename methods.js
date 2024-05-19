export const method = `
public List<Article> getAllForUserOrderedByDate(String direction, String userEmail) {
    User user = this.userRepository.findByEmail(userEmail).orElseThrow(() -> new UserNotFoundException("Can't find user with email : " + userEmail));
    // find all the topics the user is subscribed to
    List<Topic> topics = topicRepository.findAllByUsersContaining(user);
    if(topics.isEmpty()) throw new TopicNotFoundException("User subscribed to no topic.");
    List<Article> articles = null;
    // find all the articles linked to the previous topics in a requested order
    if(Objects.equals(direction, "asc")) articles = articleRepository.findByTopicInOrderByUpdatedAtAsc(topics);
    if(Objects.equals(direction, "desc")) articles = articleRepository.findByTopicInOrderByUpdatedAtDesc(topics);
    if(articles == null) throw new BadRequestException();
    if(articles.isEmpty()) throw new ArticleNotFoundException("Can't find any article");
    return articles;
}
`


export const method2 = `
@PostMapping("article")
public ResponseEntity<Void> postArticle(@Valid @RequestBody NewArticlePayloadDto articleRequest, Principal principal){
    String emailAuthor = principal.getName();
    String parentTopicId = articleRequest.getTopicId();
    String articleTitle = articleRequest.getTitle();
    String articleContent = articleRequest.getContent();

    articleService.create(emailAuthor, Long.parseLong(parentTopicId), articleTitle, articleContent);

    return ResponseEntity.ok().build();
}
`