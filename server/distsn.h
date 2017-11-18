#ifndef DISTSN_H
#define DISTSN_H


#include "tinyxml2.h"
#include "picojson.h"
#include <sys/file.h>


class ExceptionWithLineNumber: public std::exception {
public:
	unsigned int line;
public:
	ExceptionWithLineNumber () {
		line = 0;
	};
	ExceptionWithLineNumber (unsigned int a_line) {
		line = a_line;
	};
};


class HttpException: public ExceptionWithLineNumber {
public:
	HttpException (unsigned int a_line): ExceptionWithLineNumber (a_line) { };
	HttpException () { };
};


class HostException: public ExceptionWithLineNumber {
public:
	HostException (unsigned int a_line): ExceptionWithLineNumber (a_line) { };
	HostException () { };
};


class TootException: public ExceptionWithLineNumber {
public:
	TootException (unsigned int a_line): ExceptionWithLineNumber (a_line) { };
	TootException () { };
};


class UserException: public ExceptionWithLineNumber {
public:
	UserException (unsigned int a_line): ExceptionWithLineNumber (a_line) { };
	UserException () { };
};


class ModelException: public ExceptionWithLineNumber {
public:
	ModelException () { };
	ModelException (unsigned int a_line): ExceptionWithLineNumber (a_line) { };
};


class UserAndWords {
public:
	std::string user;
	std::string host;
	std::vector <std::string> words;
};


class WriteLock {
public:
	int fd;
	std::string path;
	bool ok;
public:
	WriteLock (std::string a_path);
	~WriteLock ();
};


std::string get_id (const picojson::value &toot);
std::vector <picojson::value> get_timeline (std::string host);
std::string http_get (std::string url);
time_t get_time (const picojson::value &toot);
time_t str2time (std::string s);


std::string escape_json (std::string in);
std::vector <std::string> get_words_from_toots (std::vector <std::string> toots, unsigned int word_length, unsigned int vocabulary_size);
void get_profile (std::string host, std::string user, std::string &a_screen_name, std::string &a_bio, std::vector <std::string> &a_toots, std::string &a_avatar);
void get_profile (std::string host, std::string user, std::string &a_screen_name, std::string &a_bio, std::vector <std::string> &a_toots);
std::vector <std::string> get_words (std::string host, std::string user, unsigned int word_length, unsigned int vocabulary_size);

std::vector <UserAndWords> read_storage (std::string filename);


#endif /* #ifndef DISTSN_H */

