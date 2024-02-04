#include <chrono>
#include <iostream>
// #include <math.h>
#include <thread>

// using std::cin;
using std::cout;
using std::string;
// using std::endl;
#define endl '\n';

class Entity {
public:
  Entity() {}
  void velocityEngineX() {
    while (true) {
      int timeToDelay = std::abs(30 / this->velocity.x);
      if (this->velocity.x > 0) {
        cout << "x";
        // std::this_thread::sleep_for(std::chrono::milliseconds(500));
        this->velocity.x++;
      }
    }
  }
  string objString = "";
  bool visible = false;
  int x = 0;
  int y = 0;
  struct {
    int x = 0;
    int y = 0;
  } velocity;
  void render(int x, int y) {
    visible = true;
    this->x = x;
    this->y = y;
    // std::thread tvx(&velocityEngineX, this);

    // cout << "r";
    std::thread tvx(&Entity::velocityEngineX, *this);
    // return *this;
  }
};

void render(Entity *entities, int size) {
  for (int i = 0; i < size; ++i) {
    if (entities[i].visible) {
      cout << entities[i].objString << endl;
    }
  }
}

int main() {
  // cout << "test" << endl;

  const int entityCount = 1;
  Entity entities[entityCount] = {Entity()};

  entities[0].objString = "XYZ";
  entities[0].visible = true;
  entities[0].velocity.x = 1;
  entities[0].render(0, 0);

  // std::thread t1(render, entities, entityCount);

  // t1.join();

  while (true) {
  }

  return 0;
}
