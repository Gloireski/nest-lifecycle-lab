erDiagram
    %% Core
    users ||--o{ jobs : creates
    users ||--o{ applications : submits
    users ||--o{ blog_posts : writes
    users ||--o{ comments : posts
    users ||--o{ notifications : receives
    users ||--o{ cv_analyses : performs
    users }o--o| companies : "works_for"
    
    companies ||--o{ jobs : publishes
    
    %% Jobs
    jobs ||--o{ applications : receives
    jobs ||--o{ application_clicks : tracks
    jobs ||--o{ cv_analyses : analyzes
    
    %% Blog
    blog_posts ||--o{ comments : has
    blog_posts }o--|| blog_categories : belongs_to
    blog_posts ||--o{ post_likes : has
    blog_posts }o--o{ tags : tagged_with
    
    comments }o--o| comments : replies_to
    comments ||--o{ comment_likes : has
    
    %% Articles
    articles }o--|| article_categories : belongs_to
    articles }o--o{ tags : tagged_with
    
    %% Events
    events ||--o{ event_registrations : has
    users ||--o{ event_registrations : registers
    
    %% Gamification
    users ||--o{ user_badges : earns
    badges ||--o{ user_badges : awarded_to