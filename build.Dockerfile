FROM ruby:3.0.2-buster AS builder

ENV RAILS_ENV=production SECRET_KEY_BASE=1 APP_DIR=/rails-app

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
 && apt-get update -qq && apt-get install -qq --no-install-recommends nodejs \
 && apt-get clean \
 && npm install -g yarn@1

RUN mkdir $APP_DIR
WORKDIR $APP_DIR

RUN gem install bundler
COPY Gemfile ./Gemfile
COPY Gemfile.lock ./Gemfile.lock

RUN bundle install

COPY . .

RUN yarn install --check-files
RUN rake assets:precompile

FROM ruby:3.0.2-buster

ENV RAILS_ENV=production APP_DIR=/rails-app

RUN mkdir $APP_DIR
WORKDIR $APP_DIR

EXPOSE 3000

RUN gem install bundler
COPY Gemfile ./Gemfile
COPY Gemfile.lock ./Gemfile.lock
RUN bundle install
COPY . .
COPY --from=builder /wow-query/public/packs/ $APP_DIR/public/packs/

COPY ".docker/entrypoint.sh" /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["rails", "s"]
